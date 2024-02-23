function clearHtmlTags(content) {
  let div = document.createElement('div');
  div.innerHTML = content;
  return div.textContent || div.innerText;
}

export { clearHtmlTags };
