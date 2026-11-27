package com.marketflow.inventory;
import com.marketflow.common.ApiException;
import com.marketflow.products.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
/** The ONLY place stock quantities change. Every change writes a movement row. Call inside a transaction. */
@Service public class InventoryService{
 private final InventoryMovementRepository movements;private final ProductRepository products;
 public InventoryService(InventoryMovementRepository m,ProductRepository p){movements=m;products=p;}
 public Product record(Product p,int change,String type,String reason,UUID userId){
  if(p.quantity+change<0) throw new ApiException(HttpStatus.BAD_REQUEST,"Insufficient stock for "+p.name);
  p.quantity+=change;products.save(p);
  InventoryMovement m=new InventoryMovement();m.businessId=p.businessId;m.productId=p.id;m.quantityChange=change;m.type=type;m.reason=reason;m.userId=userId;movements.save(m);
  return p;}
 public List<InventoryMovement> history(UUID productId,UUID businessId){return movements.findByProductIdAndBusinessIdOrderByCreatedAtDesc(productId,businessId);}
}
