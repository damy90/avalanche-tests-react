package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.AvalancheTestsApp;

import com.mycompany.myapp.domain.AvalancheTest;
import com.mycompany.myapp.repository.AvalancheTestRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AvalancheTestResource REST controller.
 *
 * @see AvalancheTestResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AvalancheTestsApp.class)
public class AvalancheTestResourceIntTest {

    private static final Double DEFAULT_LON = 1D;
    private static final Double UPDATED_LON = 2D;

    private static final Double DEFAULT_LAT = 1D;
    private static final Double UPDATED_LAT = 2D;

    private static final String DEFAULT_PLACE = "AAAAAAAAAA";
    private static final String UPDATED_PLACE = "BBBBBBBBBB";

    private static final Integer DEFAULT_DANGER_LEVEL = 1;
    private static final Integer UPDATED_DANGER_LEVEL = 2;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_USER = "AAAAAAAAAA";
    private static final String UPDATED_USER = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private AvalancheTestRepository avalancheTestRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAvalancheTestMockMvc;

    private AvalancheTest avalancheTest;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AvalancheTestResource avalancheTestResource = new AvalancheTestResource(avalancheTestRepository);
        this.restAvalancheTestMockMvc = MockMvcBuilders.standaloneSetup(avalancheTestResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AvalancheTest createEntity(EntityManager em) {
        AvalancheTest avalancheTest = new AvalancheTest()
            .lon(DEFAULT_LON)
            .lat(DEFAULT_LAT)
            .place(DEFAULT_PLACE)
            .dangerLevel(DEFAULT_DANGER_LEVEL)
            .content(DEFAULT_CONTENT)
            .user(DEFAULT_USER)
            .dateCreated(DEFAULT_DATE_CREATED);
        return avalancheTest;
    }

    @Before
    public void initTest() {
        avalancheTest = createEntity(em);
    }

    @Test
    @Transactional
    public void createAvalancheTest() throws Exception {
        int databaseSizeBeforeCreate = avalancheTestRepository.findAll().size();

        // Create the AvalancheTest
        restAvalancheTestMockMvc.perform(post("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avalancheTest)))
            .andExpect(status().isCreated());

        // Validate the AvalancheTest in the database
        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeCreate + 1);
        AvalancheTest testAvalancheTest = avalancheTestList.get(avalancheTestList.size() - 1);
        assertThat(testAvalancheTest.getLon()).isEqualTo(DEFAULT_LON);
        assertThat(testAvalancheTest.getLat()).isEqualTo(DEFAULT_LAT);
        assertThat(testAvalancheTest.getPlace()).isEqualTo(DEFAULT_PLACE);
        assertThat(testAvalancheTest.getDangerLevel()).isEqualTo(DEFAULT_DANGER_LEVEL);
        assertThat(testAvalancheTest.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testAvalancheTest.getUser()).isEqualTo(DEFAULT_USER);
        assertThat(testAvalancheTest.getDateCreated()).isEqualTo(DEFAULT_DATE_CREATED);
    }

    @Test
    @Transactional
    public void createAvalancheTestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = avalancheTestRepository.findAll().size();

        // Create the AvalancheTest with an existing ID
        avalancheTest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvalancheTestMockMvc.perform(post("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avalancheTest)))
            .andExpect(status().isBadRequest());

        // Validate the AvalancheTest in the database
        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkUserIsRequired() throws Exception {
        int databaseSizeBeforeTest = avalancheTestRepository.findAll().size();
        // set the field null
        avalancheTest.setUser(null);

        // Create the AvalancheTest, which fails.

        restAvalancheTestMockMvc.perform(post("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avalancheTest)))
            .andExpect(status().isBadRequest());

        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = avalancheTestRepository.findAll().size();
        // set the field null
        avalancheTest.setDateCreated(null);

        // Create the AvalancheTest, which fails.

        restAvalancheTestMockMvc.perform(post("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avalancheTest)))
            .andExpect(status().isBadRequest());

        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAvalancheTests() throws Exception {
        // Initialize the database
        avalancheTestRepository.saveAndFlush(avalancheTest);

        // Get all the avalancheTestList
        restAvalancheTestMockMvc.perform(get("/api/avalanche-tests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(avalancheTest.getId().intValue())))
            .andExpect(jsonPath("$.[*].lon").value(hasItem(DEFAULT_LON.doubleValue())))
            .andExpect(jsonPath("$.[*].lat").value(hasItem(DEFAULT_LAT.doubleValue())))
            .andExpect(jsonPath("$.[*].place").value(hasItem(DEFAULT_PLACE.toString())))
            .andExpect(jsonPath("$.[*].dangerLevel").value(hasItem(DEFAULT_DANGER_LEVEL)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].user").value(hasItem(DEFAULT_USER.toString())))
            .andExpect(jsonPath("$.[*].dateCreated").value(hasItem(sameInstant(DEFAULT_DATE_CREATED))));
    }
    

    @Test
    @Transactional
    public void getAvalancheTest() throws Exception {
        // Initialize the database
        avalancheTestRepository.saveAndFlush(avalancheTest);

        // Get the avalancheTest
        restAvalancheTestMockMvc.perform(get("/api/avalanche-tests/{id}", avalancheTest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(avalancheTest.getId().intValue()))
            .andExpect(jsonPath("$.lon").value(DEFAULT_LON.doubleValue()))
            .andExpect(jsonPath("$.lat").value(DEFAULT_LAT.doubleValue()))
            .andExpect(jsonPath("$.place").value(DEFAULT_PLACE.toString()))
            .andExpect(jsonPath("$.dangerLevel").value(DEFAULT_DANGER_LEVEL))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.user").value(DEFAULT_USER.toString()))
            .andExpect(jsonPath("$.dateCreated").value(sameInstant(DEFAULT_DATE_CREATED)));
    }
    @Test
    @Transactional
    public void getNonExistingAvalancheTest() throws Exception {
        // Get the avalancheTest
        restAvalancheTestMockMvc.perform(get("/api/avalanche-tests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAvalancheTest() throws Exception {
        // Initialize the database
        avalancheTestRepository.saveAndFlush(avalancheTest);

        int databaseSizeBeforeUpdate = avalancheTestRepository.findAll().size();

        // Update the avalancheTest
        AvalancheTest updatedAvalancheTest = avalancheTestRepository.findById(avalancheTest.getId()).get();
        // Disconnect from session so that the updates on updatedAvalancheTest are not directly saved in db
        em.detach(updatedAvalancheTest);
        updatedAvalancheTest
            .lon(UPDATED_LON)
            .lat(UPDATED_LAT)
            .place(UPDATED_PLACE)
            .dangerLevel(UPDATED_DANGER_LEVEL)
            .content(UPDATED_CONTENT)
            .user(UPDATED_USER)
            .dateCreated(UPDATED_DATE_CREATED);

        restAvalancheTestMockMvc.perform(put("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAvalancheTest)))
            .andExpect(status().isOk());

        // Validate the AvalancheTest in the database
        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeUpdate);
        AvalancheTest testAvalancheTest = avalancheTestList.get(avalancheTestList.size() - 1);
        assertThat(testAvalancheTest.getLon()).isEqualTo(UPDATED_LON);
        assertThat(testAvalancheTest.getLat()).isEqualTo(UPDATED_LAT);
        assertThat(testAvalancheTest.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testAvalancheTest.getDangerLevel()).isEqualTo(UPDATED_DANGER_LEVEL);
        assertThat(testAvalancheTest.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testAvalancheTest.getUser()).isEqualTo(UPDATED_USER);
        assertThat(testAvalancheTest.getDateCreated()).isEqualTo(UPDATED_DATE_CREATED);
    }

    @Test
    @Transactional
    public void updateNonExistingAvalancheTest() throws Exception {
        int databaseSizeBeforeUpdate = avalancheTestRepository.findAll().size();

        // Create the AvalancheTest

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAvalancheTestMockMvc.perform(put("/api/avalanche-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(avalancheTest)))
            .andExpect(status().isBadRequest());

        // Validate the AvalancheTest in the database
        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAvalancheTest() throws Exception {
        // Initialize the database
        avalancheTestRepository.saveAndFlush(avalancheTest);

        int databaseSizeBeforeDelete = avalancheTestRepository.findAll().size();

        // Get the avalancheTest
        restAvalancheTestMockMvc.perform(delete("/api/avalanche-tests/{id}", avalancheTest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AvalancheTest> avalancheTestList = avalancheTestRepository.findAll();
        assertThat(avalancheTestList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AvalancheTest.class);
        AvalancheTest avalancheTest1 = new AvalancheTest();
        avalancheTest1.setId(1L);
        AvalancheTest avalancheTest2 = new AvalancheTest();
        avalancheTest2.setId(avalancheTest1.getId());
        assertThat(avalancheTest1).isEqualTo(avalancheTest2);
        avalancheTest2.setId(2L);
        assertThat(avalancheTest1).isNotEqualTo(avalancheTest2);
        avalancheTest1.setId(null);
        assertThat(avalancheTest1).isNotEqualTo(avalancheTest2);
    }
}
