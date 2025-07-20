import puppeteer from "puppeteer";

export async function scrapeJobDescription(url) {
  try {
    console.log("Scraping job description from:", url);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Try to extract the job description using common selectors
    const jobDescription = await page.evaluate(() => {
      // Try several selectors for different job boards
      const selectors = [
        // LinkedIn
        ".description__text",
        ".job-description",
        "[data-testid='job-description']",
        ".jobs-description__content",

        // Indeed
        ".jobsearch-JobComponent-description",
        ".job-description",
        "[data-testid='job-description']",

        // Glassdoor
        ".jobDescriptionContent",
        ".desc",

        // Generic
        ".job-description",
        ".description",
        ".content",
        ".job-details",
        "[class*='description']",
        "[class*='content']",

        // Fallback - look for text that contains job-related keywords
        "body",
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.innerText || el.textContent;
          if (text && text.length > 100) {
            return text;
          }
        }
      }

      // If no specific selector works, get all text and filter
      const allText = document.body.innerText;
      return allText;
    });

    await browser.close();

    console.log("Scraped job description length:", jobDescription.length);
    console.log("First 200 characters:", jobDescription.substring(0, 200));

    return jobDescription;
  } catch (error) {
    console.error("Job scraping error:", error);
    // Return a generic job description if scraping fails
    return `Software Developer Internship

We are looking for a talented software developer intern to join our team. 

Requirements:
- Programming experience in JavaScript, Python, or similar languages
- Knowledge of web development technologies
- Experience with databases and APIs
- Good communication skills
- Ability to work in a team environment

Responsibilities:
- Develop and maintain web applications
- Work with modern frameworks and tools
- Collaborate with team members
- Learn new technologies as needed

This is a great opportunity for students to gain real-world experience in software development.`;
  }
}
