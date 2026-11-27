package com.marketflow.businesses;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="businesses") public class Business{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public String name,category,address;public String currency="NGN";public BigDecimal vatRate=new BigDecimal("7.5");public Instant createdAt=Instant.now();}
