package com.marketflow.users;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User,UUID>{boolean existsByEmail(String e);Optional<User> findByEmail(String e);List<User> findByBusinessId(UUID b);}
