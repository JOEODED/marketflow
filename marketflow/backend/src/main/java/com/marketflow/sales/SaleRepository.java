package com.marketflow.sales;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface SaleRepository extends JpaRepository<Sale,UUID>{
 List<Sale> findByBusinessIdOrderByCreatedAtDesc(UUID b);
 @Query("select coalesce(sum(s.subtotal),0) from Sale s where s.businessId=:b and s.createdAt>=:from") BigDecimal revenueSince(@Param("b") UUID b,@Param("from") Instant from);
 @Query("select coalesce(sum(s.cogs),0) from Sale s where s.businessId=:b and s.createdAt>=:from") BigDecimal cogsSince(@Param("b") UUID b,@Param("from") Instant from);
}
