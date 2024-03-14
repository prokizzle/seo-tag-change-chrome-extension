// Function to send message to background script
function notifyBackgroundScript(info) {
  // chrome.runtime.sendMessage(info);
}

// Function to count tags and notify
function countAndNotify() {
  const titleCount = document.getElementsByTagName('title').length;
  const metaDescriptionCount = document.querySelectorAll('meta[name="description"]').length;
  const canonicalLinkCount = document.querySelectorAll('link[rel="canonical"]').length;
  const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');

  // notifyBackgroundScript({
  //   type: 'count',
  //   titleCount,
  //   metaDescriptionCount,
  //   canonicalLinkCount
  // });
  //
  // notifyBackgroundScript({
  //   type: "current-meta-description",
  //   content: metaDescription,
  // })
}

const tailwindLink = document.createElement('link');
tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'; // Using a CDN for simplicity
tailwindLink.rel = 'stylesheet';
document.head.appendChild(tailwindLink);

// Create and style the modal using Tailwind classes
const modal = document.createElement('div');
modal.classList.add('fixed', 'top-10', 'right-10', 'bg-white', 'border', 'border-gray-300', 'p-4', 'shadow-lg', 'max-h-128', 'overflow-y-auto', 'hidden', 'z-50', 'rounded-lg', 'w-200');
modal.style.maxWidth = '400px';

// Append modal to body
document.body.appendChild(modal);

// Function to show mutations in the modal
function showMutationInfo(mutationInfo) {
  modal.innerHTML = mutationInfo;
  modal.classList.remove('hidden'); // Show the modal using Tailwind utility class
}

function updateModal(content) {
  modal.innerHTML = content;
  modal.classList.remove('hidden');
}

function countElements() {
  const titleCount = document.querySelectorAll('head > title').length;
  const metaDescriptionCount = document.querySelectorAll('head > meta[name="description"]').length;
  const canonicalLinkCount = document.querySelectorAll('head > link[rel="canonical"]').length;

  return { titleCount, metaDescriptionCount, canonicalLinkCount };
}

function getInitialValues() {
  const initialTitle = document.querySelector('head > title')?.textContent || 'No title';
  const initialDescription = document.querySelector('head > meta[name="description"]')?.getAttribute('content') || 'No description';
  const initialCanonical = document.querySelector('head > link[rel="canonical"]')?.getAttribute('href') || 'No canonical link';

  return { initialTitle, initialDescription, initialCanonical };
}


function createInitialValuesSection() {
  const initialValues = getInitialValues();
  const initialValuesSection = `
    <div class="text-sm mb-4 text-black">
      <div><strong>Title:</strong> ${initialValues.initialTitle}</div>
      <div><strong>Description:</strong> ${initialValues.initialDescription}</div>
      <div><strong>Canonical:</strong> ${initialValues.initialCanonical}</div>
    </div>
  `;
  return initialValuesSection;
}


// Observe changes in the document's title, meta description, and canonical link
const observer = new MutationObserver(mutations => {
  let isTitleChanged = false;
  let isMetaDescChanged = false;
  let isCanonicalChanged = false;
  let content = createInitialValuesSection();
  let counts = countElements();

  content += `<div class="text-xs text-gray-500 mt-2"><strong>Titles:</strong> ${counts.titleCount}<br/>  <strong>Descriptions:</strong> ${counts.metaDescriptionCount}<br/> <strong>Canonical Links:</strong> ${counts.canonicalLinkCount}</div><hr/>`;


  mutations.forEach(mutation => {
    if (mutation.target.nodeName === 'TITLE') {
      content += `<p class="text-sm text-gray-800"><strong>Title changed:</strong> ${mutation.target.innerHTML}</p>`;
      isTitleChanged = true;
    } else if (mutation.target.nodeName === 'META' && mutation.target.getAttribute('name') === 'description') {
      content += `<p class="text-sm text-gray-800"><strong>Meta description changed:</strong> ${mutation.target.getAttribute('content')}</p>`;
      isMetaDescChanged = true;
    } else if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        console.log({ node })
        if (node.nodeName === 'LINK' && node.getAttribute('rel') === 'canonical') {
          // notifyBackgroundScript({ type: 'canonical-link-added', content: node.getAttribute('href') });
          content += `<p class="text-sm text-gray-800"><strong>Canonical link added:</strong> ${node.getAttribute('href')}</p>`;
          isCanonicalChanged = true;
        }
      });
      mutation.removedNodes.forEach(node => {
        console.log({ node })
        if (node.nodeName === 'LINK' && node.getAttribute('rel') === 'canonical') {
          // notifyBackgroundScript({ type: 'canonical-link-removed', content: node.getAttribute('href') });
          content += `<p class="text-sm text-gray-800"><strong>Canonical link removed:</strong> ${node.getAttribute('href')}</p>`;
          isCanonicalChanged = true;
        }
      });

      if (content.length > 0) {
        updateModal(content);
      }
    }
  });

  // If any of the tracked elements have changed, update the count
  // if (isTitleChanged || isMetaDescChanged || isCanonicalChanged) {
  //   countAndNotify();
  // }
});

observer.observe(document.head, { childList: true, subtree: true, attributes: true });

// Initial count and notify on page load
// countAndNotify();

// Initial element counts
// let initialCounts = countElements();
// updateModal(`Initial counts - Titles: ${initialCounts.titleCount}, Descriptions: ${initialCounts.metaDescriptionCount}, Canonical Links: ${initialCounts.canonicalLinkCount}`);


