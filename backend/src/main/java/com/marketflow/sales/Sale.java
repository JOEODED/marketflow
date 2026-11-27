package com.marketflow.sales;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
@Entity @Table(name="sales") public class Sale{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID businessId,userId;public BigDecimal subtotal,tax,total,cogs;public String paymentMethod;public Instant createdAt=Instant.now();
 @OneToMany(cascade=CascadeType.ALL,fetch=FetchType.EAGER) @JoinColumn(name="sale_id",nullable=false) public List<SaleItem> items=new ArrayList<>();}
