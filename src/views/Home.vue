<template>
  <div class="home-container">
    <!-- About Us Section -->
    <section class="about-us">
      <h2>About Us</h2>
      <div class="about-content">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team Meeting" />
        <p>
          At [Your Platform Name], we connect ambitious job seekers with exciting career opportunities in Dubai and other global cities. Our mission is to simplify the job search process by offering a reliable, user-friendly platform where talent meets opportunity. Join thousands of professionals who trust us to take the next big step in their careers.
        </p>
      </div>
      <button class="btn-primary">Apply Now</button>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us">
      <h2>Why Choose Us</h2>
      <div class="choose-us-content">
        <div class="text-content">
          <h3>Dedicated Support Team</h3>
          <p>
            Our support team is always ready to help you navigate the job search process. Whether you need assistance with your application or advice on job matching, we’re here to make sure you’re never alone on your journey.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" alt="Support Team" />
      </div>
    </section>

    <!-- Partners Section -->
    <section class="partners">
      <h2>Partners</h2>
      <div class="partners-list">
        <div class="partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Janta_logo.svg/1200px-Janta_logo.svg.png" alt="Janta" />
          <p>Janta</p>
        </div>
        <div class="partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Accurex_logo.svg/1200px-Accurex_logo.svg.png" alt="Accurex" />
          <p>Accurex</p>
        </div>
        <div class="partner">
          <img src="https://malconsultancy.com/wp-content/uploads/2020/06/MAL-Consultancy-Logo.png" alt="MAL Consultancy" />
          <p>MAL Consultancy</p>
        </div>
        <div class="partner">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hallmark_logo.svg/1200px-Hallmark_logo.svg.png" alt="Hallmark" />
          <p>Hallmark</p>
        </div>
      </div>
    </section>

    <!-- Experiences Section -->
    <section class="experiences">
      <h2>Experiences</h2>
      <div class="experience-list">
        <div class="experience-item">
          <img src="v108_548.png" alt="Kevin Muriithi" />
          <p><strong>Kevin Muriithi</strong></p>
        </div>
        <div class="experience-item">
          <img src="v100_408.png" alt="Mary Mwen" />
          <p><strong>Mary Mwen</strong></p>
        </div>
        <div class="experience-item">
          <img src="v108_407.png" alt="Joseph Ochiel" />
          <p><strong>Joseph Ochiel</strong></p>
        </div>
        <div class="experience-item">
          <img src="v108_406.png" alt="Martin Muriithi" />
          <p><strong>Martin Muriithi</strong></p>
        </div>
      </div>
      <div class="carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <button class="btn-primary">Explore</button>
    </section>

    <!-- Our Services Section -->
    <section class="our-services">
      <h2>Our Services</h2>
      <div class="services-list">
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Temporary and contract placements" />
          <p>Temporary and contract placements</p>
        </div>
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Technical and specialised recruitment" />
          <p>Technical and specialised recruitment</p>
        </div>
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Professional staffing" />
          <p>Professional staffing</p>
        </div>
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Permanent placements" />
          <p>Permanent placements</p>
        </div>
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Outsourcing services" />
          <p>Outsourcing services</p>
        </div>
        <div class="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Business support and service" />
          <p>Business support and service</p>
        </div>
      </div>
    </section>

    <!-- Final Apply Now Section -->
    <section class="final-apply-now">
      <div class="overlay">
        <h2>Apply Now</h2>
        <p>Join thousands of professionals who trust us to take the next big step in their careers.</p>
        <button class="btn-primary">Apply Now</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.home-container {
  font-family: Arial, sans-serif;
  color: #000;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

.about-us .about-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.about-us img {
  width: 50%;
  border-radius: 8px;
}

.about-us p {
  width: 50%;
  font-size: 16px;
  line-height: 1.5;
}

.btn-primary {
  background-color: #2a7ae2;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  display: block;
  margin: 0 auto 40px auto;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #1a5ec8;
}

.why-choose-us .choose-us-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.why-choose-us .text-content {
  width: 50%;
}

.why-choose-us img {
  width: 50%;
  border-radius: 8px;
}

.partners .partners-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.partner {
  text-align: center;
  width: 120px;
}

.partner img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
  margin-bottom: 8px;
}

.experiences .experience-list {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 10px;
}

.experience-item {
  width: 23%;
  text-align: center;
}

.experience-item img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.carousel-dots {
  text-align: center;
  margin-bottom: 20px;
}

.carousel-dots .dot {
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.carousel-dots .dot.active {
  background-color: #2a7ae2;
}

.our-services .services-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.service-item {
  width: 30%;
  text-align: center;
}

.service-item img {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.final-apply-now {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  padding: 60px 20px;
  color: #000;
  text-align: center;
  margin-bottom: 40px;
}

.final-apply-now .overlay {
  background: rgba(255, 255, 255, 0.85);
  padding: 40px 20px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.final-apply-now h2 {
  font-weight: 700;
  margin-bottom: 10px;
}

.final-apply-now p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
}
</style>
