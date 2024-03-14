chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let title, message;
  switch (request.type) {
    case 'title':
    case 'meta-description':
      title = `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} Changed`;
      message = request.content;
      break;
    case 'current-meta-description':
      title = `Current Meta Description`;
      message = request.content;
      break;
    case 'canonical-link-removed':
      title = `Canonical Link Removed`;
      message = request.content;
      break;
    case 'canonical-link-added':
      title = `Canonical Link Added`;
      message = request.content;
      break;
    case 'count':
      title = 'Element Count on Page';
      message = `Titles: ${request.titleCount}, Meta Descriptions: ${request.metaDescriptionCount}, Canonical Links: ${request.canonicalLinkCount}`;
      break;
    default:
      return;
  }

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: title,
    message: message
  });
});

