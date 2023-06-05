function fetchResource(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch resource: ${url}`);
      }
      return response.text();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(`Failed to fetch resource: ${url}`, error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Load components
  document.body.classList.add("loading");

  const components = document.querySelectorAll("[data-component]");
  const componentPromises = Array.from(components).map((component) => {
    const componentName = component.getAttribute("data-component");

    return fetchResource(`/components/${componentName}.html`)
      .then((html) => {
        component.innerHTML = html;
      })
      .catch(() => {
        component.innerHTML = "";
      });
  });

  // Wait for all component promises to resolve
  Promise.all(componentPromises)
    .then(() => {
      // Load scripts after components are loaded
      const scriptPromises = Array.from(components).map((component) => {
        const componentName = component.getAttribute("data-component");
        const scriptUrl = `/components/${componentName}.js`;

        return fetchResource(scriptUrl)
          .then(() => loadScript(scriptUrl))
          .catch((error) =>
            console.error(`Failed to load script: ${scriptUrl}`, error)
          );
      });

      // Wait for all script promises to resolve
      return Promise.all(scriptPromises);
    })
    .then(() => {
      // Show body content after components and scripts are loaded
      setTimeout(() => {
        document.body.classList.remove("loading");
      }, 5000);
    })
    .catch((error) => {
      console.error("Error loading components and scripts:", error);
    });
});

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);

    document.body.appendChild(script);
  });
}
