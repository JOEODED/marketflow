package com.marketflow.sales;
import com.marketflow.businesses.BusinessRepository;
import com.marketflow.common.*;
import com.marketflow.inventory.InventoryService;
import com.marketflow.products.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/sales") public class SaleController{
 public record SaleReq(@NotEmpty @Valid List<Item> items,@Pattern(regexp="CASH|TRANSFER|CARD|OTHER") String paymentMethod){public record Item(@NotNull UUID productId,@Min(1) int quantity){}}
 private final SaleRepository sales;private final ProductRepository products;private final InventoryService inv;private final BusinessRepository businesses;
 public SaleController(SaleRepository s,ProductRepository p,InventoryService i,BusinessRepository b){sales=s;products=p;inv=i;businesses=b;}
 @GetMapping public List<Sale> list(){return sales.findByBusinessIdOrderByCreatedAtDesc(AuthUser.current().businessId());}
 /** One transaction: stock deduction, movements and the sale succeed or fail together. */
 @PostMapping @Transactional @ResponseStatus(HttpStatus.CREATED) public Sale create(@Valid @RequestBody SaleReq r){
  AuthUser u=AuthUser.current();BigDecimal vat=businesses.findById(u.businessId()).orElseThrow().vatRate;
  Sale s=new Sale();s.businessId=u.businessId();s.userId=u.userId();s.paymentMethod=r.paymentMethod();
  BigDecimal sub=BigDecimal.ZERO,cogs=BigDecimal.ZERO;
  for(SaleReq.Item i:r.items()){
   Product p=products.lockById(i.productId(),u.businessId()).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Product not found"));
   if(p.archived) throw new ApiException(HttpStatus.BAD_REQUEST,p.name+" is archived");
   inv.record(p,-i.quantity(),"SALE","Sale",u.userId());
   SaleItem si=new SaleItem();si.productId=p.id;si.quantity=i.quantity();si.unitPrice=p.sellingPrice;si.unitCost=p.purchasePrice;s.items.add(si);
   BigDecimal q=BigDecimal.valueOf(i.quantity());sub=sub.add(p.sellingPrice.multiply(q));cogs=cogs.add(p.purchasePrice.multiply(q));}
  s.subtotal=sub;s.tax=sub.multiply(vat).divide(BigDecimal.valueOf(100),2,RoundingMode.HALF_UP);s.total=sub.add(s.tax);s.cogs=cogs;
  return sales.save(s);}
}
