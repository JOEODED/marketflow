package com.marketflow.products;
import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface ProductRepository extends JpaRepository<Product,UUID>{
 List<Product> findByBusinessIdAndArchivedFalseOrderByName(UUID b);
 Optional<Product> findByIdAndBusinessId(UUID id,UUID b);
 long countByBusinessIdAndArchivedFalse(UUID b);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select p from Product p where p.id=:id and p.businessId=:b") Optional<Product> lockById(@Param("id") UUID id,@Param("b") UUID b);
 @Query("select count(p) from Product p where p.businessId=:b and p.archived=false and p.quantity>0 and p.quantity<=p.minStock") long lowStock(@Param("b") UUID b);
 @Query("select count(p) from Product p where p.businessId=:b and p.archived=false and p.quantity=0") long outOfStock(@Param("b") UUID b);
}
