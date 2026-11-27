package com.marketflow.products;
import com.marketflow.common.*;
import com.marketflow.inventory.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/products") @Transactional public class ProductController{
 public record ProductReq(@NotBlank String name,@NotBlank String sku,String category,@NotNull @PositiveOrZero BigDecimal purchasePrice,@NotNull @PositiveOrZero BigDecimal sellingPrice,@PositiveOrZero int quantity,@PositiveOrZero int minStock){}
 public record AdjustReq(@Pattern(regexp="RESTOCK|DAMAGED|EXPIRED|CORRECTION") String type,int change,String reason){}
 private static final String MGR="hasAnyRole('BUSINESS_OWNER','MANAGER')";
 private final ProductRepository repo;private final InventoryService inv;
 public ProductController(ProductRepository r,InventoryService i){repo=r;inv=i;}
 private Product own(UUID id){return repo.findByIdAndBusinessId(id,AuthUser.current().businessId()).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Product not found"));}
 private void apply(Product p,ProductReq r){p.name=r.name();p.sku=r.sku();p.category=r.category();p.purchasePrice=r.purchasePrice();p.sellingPrice=r.sellingPrice();p.minStock=r.minStock();}
 @GetMapping public List<Product> list(){return repo.findByBusinessIdAndArchivedFalseOrderByName(AuthUser.current().businessId());}
 @GetMapping("/{id}") public Product get(@PathVariable UUID id){return own(id);}
 @PostMapping @PreAuthorize(MGR) @ResponseStatus(HttpStatus.CREATED) public Product create(@Valid @RequestBody ProductReq r){
  AuthUser u=AuthUser.current();Product p=new Product();p.businessId=u.businessId();apply(p,r);p=repo.saveAndFlush(p);
  if(r.quantity()>0) inv.record(p,r.quantity(),"INITIAL","Opening stock",u.userId());return p;}
 @PutMapping("/{id}") @PreAuthorize(MGR) public Product update(@PathVariable UUID id,@Valid @RequestBody ProductReq r){Product p=own(id);apply(p,r);return repo.saveAndFlush(p);}
 @DeleteMapping("/{id}") @PreAuthorize(MGR) @ResponseStatus(HttpStatus.NO_CONTENT) public void archive(@PathVariable UUID id){Product p=own(id);p.archived=true;repo.save(p);}
 @PostMapping("/{id}/adjust") @PreAuthorize(MGR) public Product adjust(@PathVariable UUID id,@Valid @RequestBody AdjustReq r){
  AuthUser u=AuthUser.current();if(r.change()==0) throw new ApiException(HttpStatus.BAD_REQUEST,"Change cannot be zero");
  Product p=repo.lockById(id,u.businessId()).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Product not found"));
  int c=(r.type().equals("DAMAGED")||r.type().equals("EXPIRED"))?-Math.abs(r.change()):r.change();
  return inv.record(p,c,r.type(),r.reason(),u.userId());}
 @GetMapping("/{id}/movements") public List<InventoryMovement> history(@PathVariable UUID id){own(id);return inv.history(id,AuthUser.current().businessId());}
}
