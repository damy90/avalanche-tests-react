package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AvalancheTest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AvalancheTest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AvalancheTestRepository extends JpaRepository<AvalancheTest, Long> {

}
