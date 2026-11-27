package com.marketflow.sales;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
@Entity @Table(name="sale_items") public class SaleItem{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID productId;public int quantity;public BigDecimal unitPrice,unitCost;}
