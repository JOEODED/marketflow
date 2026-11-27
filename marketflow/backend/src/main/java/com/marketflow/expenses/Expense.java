package com.marketflow.expenses;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;
@Entity @Table(name="expenses") public class Expense{
 @Id @GeneratedValue(strategy=GenerationType.UUID) public UUID id;
 public UUID businessId;public String category,description,paymentMethod;public BigDecimal amount;public LocalDate expenseDate;public Instant createdAt=Instant.now();}
