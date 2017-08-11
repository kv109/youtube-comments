const Flash = {
  display: (message, type = "info") => {
    $("[data-is=alert-container]").prepend(flashTemplate(message, type));
  }
};

const flashTemplate = (message, type) => {
  return `
<div class="alert alert-dismissible fade show alert-${type}" role="alert">
  <button class="close" type="button" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">×</span>
  </button>
  ${message}
</div>
`
};

module.exports = Flash;
