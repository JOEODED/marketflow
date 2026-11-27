package com.marketflow;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import com.marketflow.common.ApiException;
import com.marketflow.inventory.*;
import com.marketflow.products.*;
import java.util.UUID;
import org.junit.jupiter.api.Test;
class InventoryServiceTest{
 @Test void rejectsRemovingMoreStockThanAvailable(){
  var svc=new InventoryService(mock(InventoryMovementRepository.class),mock(ProductRepository.class));
  Product p=new Product();p.name="Milk";p.quantity=2;
  assertThrows(ApiException.class,()->svc.record(p,-5,"SALE","x",UUID.randomUUID()));assertEquals(2,p.quantity);}
 @Test void recordsValidChange(){
  var svc=new InventoryService(mock(InventoryMovementRepository.class),mock(ProductRepository.class));
  Product p=new Product();p.quantity=2;svc.record(p,3,"RESTOCK","x",UUID.randomUUID());assertEquals(5,p.quantity);}
}
