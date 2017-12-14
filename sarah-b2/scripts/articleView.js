'use strict';

let articleView = {};
let article ={};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why?
// this will be called on the new article page, so that different scripts will run on different pages
articleView.initNewArticlePage = () => {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();
  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#article-export').hide();
  $('#article-json').on('focus', function(){
    this.select();
    localStorage.setItem('published', JSON.stringify(article));
  });
  //DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#article-form').on('change', 'input, textarea', articleView.create);
};

articleView.create = () => {
  let article 
  // DONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#articles').empty(); // empty doesn't return anything, and doesn't obliterate everthing after it, like gutting a pumpkin, 

  // DONE: Instantiate an article based on what's in the form fields:
  article = new Article({
    author: $('#article-author').val(),
    authorUrl: $('#author-url').val(),
    title: $('#article-title').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-pubdate:checked').length ? new Date() : null,

  });
  // DONE: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').append(article.toHtml());

  // DONE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each((i, block) => hljs.highlightBlock(block));
  //hljs is the name of object in the highlight js library, highlightBlock is a method of that object.. this is an example of an anonymous function
  // DONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:

  $('#article-export').show().find('#article-json').val(JSON.stringify(article));
  

};


// COMMENT: Where is this function called? Why?
// this function is populating the drop down menus and their filter functions as well as the tab-functionality of the main-nav menu. It will be called on the the index.html page.
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
}