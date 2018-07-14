package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.AvalancheTest;
import com.mycompany.myapp.repository.AvalancheTestRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import com.mycompany.myapp.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AvalancheTest.
 */
@RestController
@RequestMapping("/api")
public class AvalancheTestResource {

    private final Logger log = LoggerFactory.getLogger(AvalancheTestResource.class);

    private static final String ENTITY_NAME = "avalancheTest";

    private final AvalancheTestRepository avalancheTestRepository;

    public AvalancheTestResource(AvalancheTestRepository avalancheTestRepository) {
        this.avalancheTestRepository = avalancheTestRepository;
    }

    /**
     * POST  /avalanche-tests : Create a new avalancheTest.
     *
     * @param avalancheTest the avalancheTest to create
     * @return the ResponseEntity with status 201 (Created) and with body the new avalancheTest, or with status 400 (Bad Request) if the avalancheTest has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/avalanche-tests")
    @Timed
    public ResponseEntity<AvalancheTest> createAvalancheTest(@Valid @RequestBody AvalancheTest avalancheTest) throws URISyntaxException {
        log.debug("REST request to save AvalancheTest : {}", avalancheTest);
        if (avalancheTest.getId() != null) {
            throw new BadRequestAlertException("A new avalancheTest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AvalancheTest result = avalancheTestRepository.save(avalancheTest);
        return ResponseEntity.created(new URI("/api/avalanche-tests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /avalanche-tests : Updates an existing avalancheTest.
     *
     * @param avalancheTest the avalancheTest to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated avalancheTest,
     * or with status 400 (Bad Request) if the avalancheTest is not valid,
     * or with status 500 (Internal Server Error) if the avalancheTest couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/avalanche-tests")
    @Timed
    public ResponseEntity<AvalancheTest> updateAvalancheTest(@Valid @RequestBody AvalancheTest avalancheTest) throws URISyntaxException {
        log.debug("REST request to update AvalancheTest : {}", avalancheTest);
        if (avalancheTest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AvalancheTest result = avalancheTestRepository.save(avalancheTest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, avalancheTest.getId().toString()))
            .body(result);
    }

    /**
     * GET  /avalanche-tests : get all the avalancheTests.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of avalancheTests in body
     */
    @GetMapping("/avalanche-tests")
    @Timed
    public ResponseEntity<List<AvalancheTest>> getAllAvalancheTests(Pageable pageable) {
        log.debug("REST request to get a page of AvalancheTests");
        Page<AvalancheTest> page = avalancheTestRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/avalanche-tests");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /avalanche-tests/:id : get the "id" avalancheTest.
     *
     * @param id the id of the avalancheTest to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the avalancheTest, or with status 404 (Not Found)
     */
    @GetMapping("/avalanche-tests/{id}")
    @Timed
    public ResponseEntity<AvalancheTest> getAvalancheTest(@PathVariable Long id) {
        log.debug("REST request to get AvalancheTest : {}", id);
        Optional<AvalancheTest> avalancheTest = avalancheTestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(avalancheTest);
    }

    /**
     * DELETE  /avalanche-tests/:id : delete the "id" avalancheTest.
     *
     * @param id the id of the avalancheTest to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/avalanche-tests/{id}")
    @Timed
    public ResponseEntity<Void> deleteAvalancheTest(@PathVariable Long id) {
        log.debug("REST request to delete AvalancheTest : {}", id);

        avalancheTestRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
