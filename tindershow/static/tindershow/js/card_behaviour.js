var tinderContainer = document.querySelector('.tinder');
var tinderCardsSpace = document.querySelector('.tinder--cards');

function loadCards(number_of_cards) {
    $.ajax({
        url: "load_cards",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            number_of_cards: number_of_cards,
            blacklist: [].slice.call(tinderCardsSpace.children).map(x => x.id),
            has_last: !!document.querySelector('.last--card')
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        success: (data) => {
            if (data !== "") {
                var div = document.createElement('temp_div');
                div.innerHTML = data;
                addNewCards(div.children);
            } else {
                updateCardStack()
            }
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function label_card(card, event) {
    if (card.classList.contains("like")) {
        card_status = "l"
    } else {
        card_status = "u"
    }
    $.ajax({
        url: "label_card",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            status: card_status, "id": card.id
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val()
        },
        success: (data) => {
            removeAndLoad(event)
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function addNewCards(new_cards) {
    new_card_array = [].slice.call(new_cards);
    old_stack = [].slice.call(tinderCardsSpace.children)
    if (old_stack.filter(e => e.classList.contains('last--card')).length === 1) {
        last__card = old_stack.filter(e => e.classList.contains('last--card'))[0]
        tinderCardsSpace.removeChild(last__card)
    }
    new_card_array.forEach(function (card) {
        decorateCard(card)
        if (tinderCardsSpace.children.length === 0) {
            tinderCardsSpace.appendChild(card)
        } else {
            tinderCardsSpace.insertBefore(card, tinderCardsSpace.lastElementChild.nextSibling)
        }
    })
    updateCardStack()
}

function removeAndLoad(event) {
    var moveOutWidth = document.body.clientWidth;
    var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
    var toX = event.deltaX > 0 ? endX : -endX;
    var endY = Math.abs(event.velocityY) * moveOutWidth;
    var toY = event.deltaY > 0 ? endY : -endY;
    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
    tinderCardsSpace.removeChild(event.target)
    loadCards(1)
}

function updateCardStack() {
    var allCards = document.querySelectorAll('.tinder--card');
    if (allCards >= number_of_max_cards) {
        last_card = document.querySelector('.last--card')
        last_card.parentNode.removeChild(last_card)
    }
    document.querySelector('.last--card')
    allCards.forEach(function (card, index) {
        card.style.zIndex = allCards.length - index;
        card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        card.style.opacity = (10 - index) / 10;
    });
    tinderContainer.classList.add('loaded');
}

function decorateCard(card) {
    var hammertime = new Hammer(card);
    hammertime.on('pan', function (event) {
        if (!event.target.classList.contains("tinder--card")) {
            return;
        }
        card.classList.add('moving');
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);
        event.target.classList.toggle('like', event.deltaX > 0);
        event.target.classList.toggle('dislike', event.deltaX < 0);
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
        if (!event.target.classList.contains("tinder--card")) {
            return;
        }
        if (event.target.classList.contains("last--card")) {
            event.target.style.transform = '';
        }
        card.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');
        var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
        if (keep) {
            event.target.style.transform = '';
        } else {
            if (!event.target.classList.contains("last--card")) {
                label_card(event.target, event);
            }
        }
    });
}

loadCards(number_of_max_cards);