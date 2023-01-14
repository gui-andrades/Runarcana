mw.loader.using("jquery.throttle-debounce", function () {
  $(function () {
    var $window,
      $mwPanel,
      $floatTOC,
      scrollHandler,
      tocLimit,
      headingOffsets,
      headingThreshold,
      $toc = $("#toc");

    if (!$toc.length) {
      return;
    }

    $window = $(window);
    $mwPanel = $("#mw-panel");

    headingThreshold = $window.height() / 5.0;

    $floatTOC = $toc
      .clone()
      .removeAttr("id")
      .addClass("floatTOC")
      .appendTo("body")
      .css({ visibility: "hidden", opacity: 0 });

    $floatTOC.find("ul").show();

    $floatTOC.find("a").click(function (e) {
      $("html, body").animate({
        scrollTop:
          $(this.hash.replace(/\./g, "\\.")).offset().top - headingThreshold,
      });

      return false;
    });

    tocLimit = $toc.offset().top + $toc.height();
    headingOffsets = [];

    $(".mw-headline").each(function () {
      headingOffsets.push([$(this).attr("id"), $(this).offset().top]);
    });

    scrollHandler = function () {
      var $current,
        scrollTop = $window.scrollTop();

      if (scrollTop > tocLimit) {
        $floatTOC.css({ visibility: "visible", opacity: 1 });

        $mwPanel.hide();

        var highlight = false;

        $.each(headingOffsets, function (i, v) {
          if (i !== 0 && scrollTop + headingThreshold < v[1]) {
            highlight = headingOffsets[i - 1][0];
            return false;
          }
        });

        if (highlight) {
          $current = $floatTOC.find('a[href="#' + highlight + '"]');
          $floatTOC.find("a").not($current).css("font-weight", "");
          $current.css("font-weight", "bold");
        }
      } else {
        $floatTOC.css({ visibility: "hidden", opacity: 0 });

        $mwPanel.show();
      }
    };

    $window.on("scroll", $.throttle(250, scrollHandler));
  });
});
