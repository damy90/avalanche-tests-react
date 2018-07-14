package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A AvalancheTest.
 */
@Entity
@Table(name = "avalanche_test")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class AvalancheTest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "lon")
    private Double lon;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "place")
    private String place;

    @Column(name = "danger_level")
    private Integer dangerLevel;

    @Column(name = "content")
    private String content;

    @NotNull
    @Size(min = 2)
    @Column(name = "jhi_user", nullable = false)
    private String user;

    @NotNull
    @Column(name = "date_created", nullable = false)
    private ZonedDateTime dateCreated;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLon() {
        return lon;
    }

    public AvalancheTest lon(Double lon) {
        this.lon = lon;
        return this;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public Double getLat() {
        return lat;
    }

    public AvalancheTest lat(Double lat) {
        this.lat = lat;
        return this;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public String getPlace() {
        return place;
    }

    public AvalancheTest place(String place) {
        this.place = place;
        return this;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public Integer getDangerLevel() {
        return dangerLevel;
    }

    public AvalancheTest dangerLevel(Integer dangerLevel) {
        this.dangerLevel = dangerLevel;
        return this;
    }

    public void setDangerLevel(Integer dangerLevel) {
        this.dangerLevel = dangerLevel;
    }

    public String getContent() {
        return content;
    }

    public AvalancheTest content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUser() {
        return user;
    }

    public AvalancheTest user(String user) {
        this.user = user;
        return this;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public ZonedDateTime getDateCreated() {
        return dateCreated;
    }

    public AvalancheTest dateCreated(ZonedDateTime dateCreated) {
        this.dateCreated = dateCreated;
        return this;
    }

    public void setDateCreated(ZonedDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AvalancheTest avalancheTest = (AvalancheTest) o;
        if (avalancheTest.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), avalancheTest.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AvalancheTest{" +
            "id=" + getId() +
            ", lon=" + getLon() +
            ", lat=" + getLat() +
            ", place='" + getPlace() + "'" +
            ", dangerLevel=" + getDangerLevel() +
            ", content='" + getContent() + "'" +
            ", user='" + getUser() + "'" +
            ", dateCreated='" + getDateCreated() + "'" +
            "}";
    }
}
