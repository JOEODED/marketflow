package com.marketflow.users;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="users") public class User{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID businessId;public String email,passwordHash,fullName,role;public Instant createdAt=Instant.now();}
