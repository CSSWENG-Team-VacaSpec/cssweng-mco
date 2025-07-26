const express = require('express');
const router = express.Router();
const searchBarController = require('../controllers/searchBarController');

router.get('/searchEmployees', searchBarController.searchEmployees);
router.get('/searchTeamMembers', searchBarController.searchTeamMembers);
router.get('/searchEvents', searchBarController.searchEvents);
module.exports = router;

/*
Sample Usage

<input type="text" id="searchBox" placeholder="Search employees..." />
<div id="resultsContainer"></div>

<script>
  const searchBox = document.getElementById("searchBox");
  const resultsContainer = document.getElementById("resultsContainer");

  searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }

    try {
      const res = await fetch(`/searchEmployees?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      resultsContainer.innerHTML = '';

      if (data.results.length === 0) {
        resultsContainer.innerHTML = '<p>No employees found.</p>';
        return;
      }

      data.results.forEach(emp => {
        const div = document.createElement("div");
        div.textContent = `${emp.firstName} ${emp.lastName} (${emp._id})`;
        resultsContainer.appendChild(div);
      });

    } catch (err) {
      console.error("Search error:", err);
      resultsContainer.innerHTML = '<p>Something went wrong.</p>';
    }
  });
</script>


*/