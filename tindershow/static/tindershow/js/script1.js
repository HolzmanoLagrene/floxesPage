var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');

function initCards(card, index) {
    var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

    newCards.forEach(function (card, index) {
        card.style.zIndex = allCards.length - index;
        card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        card.style.opacity = (10 - index) / 10;
    });
    tinderContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
    var hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
        el.classList.add('moving');
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);
        event.target.classList.toggle('tinder_love', event.deltaX > 0);
        event.target.classList.toggle('tinder_nope', event.deltaX < 0);
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
        el.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');

        var moveOutWidth = document.body.clientWidth;
        var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
        var status = "u"

        if (!event.target.classList.contains("last--card")) {
            event.target.classList.toggle('removed', !keep);
        }
        if (keep) {
            event.target.style.transform = '';
        } else {
            if (event.target.classList.contains("tinder_nope")) {
                status = "d"
            } else {
                status = "l"
            }
            $.ajax({
                url: "label",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                   status: status, "id": event.target.id
                }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
                },
                success: (data) => {
                    console.log(data);
                },
                error: (error) => {
                    console.log(error);
                }
            });
            var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
            var toX = event.deltaX > 0 ? endX : -endX;
            var endY = Math.abs(event.velocityY) * moveOutWidth;
            var toY = event.deltaY > 0 ? endY : -endY;
            var xMulti = event.deltaX * 0.03;
            var yMulti = event.deltaY / 80;
            var rotate = xMulti * yMulti;

            event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
            initCards();
        }
    });
});

