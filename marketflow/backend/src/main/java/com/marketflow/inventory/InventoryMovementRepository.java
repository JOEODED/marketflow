package com.marketflow.inventory;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement,UUID>{List<InventoryMovement> findByProductIdAndBusinessIdOrderByCreatedAtDesc(UUID p,UUID b);}
