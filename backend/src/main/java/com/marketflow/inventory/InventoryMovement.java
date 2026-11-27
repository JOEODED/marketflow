package com.marketflow.inventory;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="inventory_movements") public class InventoryMovement{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID businessId,productId,userId;public int quantityChange;public String type,reason;public Instant createdAt=Instant.now();}
