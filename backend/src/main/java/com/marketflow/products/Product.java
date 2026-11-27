package com.marketflow.products;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="products") public class Product{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID businessId;public String name,sku,category;public BigDecimal purchasePrice,sellingPrice;
 public int quantity,minStock;public boolean archived;public Instant createdAt=Instant.now();}
