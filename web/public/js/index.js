$(document).ready(function() {
    (function worker2() {
        $.ajax({
            url: '/status',
            beforeSend: function(xhr, opts) {
                set_status_spinner();
            },
            success: function(data) {
                update_branches(data);

                set_status_ok();
                setTimeout(worker2, 10 * 1000);
            },
            error: function() {
                set_status_error();
                setTimeout(worker2, 1000);
            }
        });
    })();


    // this is for status button
    var class_ok = {
        msg: ' Система активна',
        class: 'fa fa-refresh'
    }
    var class_spin = {
        msg: ' Перевірка статусу системи...',
        class: 'fa fa-refresh fa-spin'
    }
    var class_err = {
        msg: ' В системі помилка',
        class: 'status-error'
    }

    function set_status_error() {
        $(".card").addClass(class_err.class);
        $(".btn-start").addClass('disabled');

        $(".status-span").css('display', 'inline-block');
    }

    function set_status_ok() {
        $(".card").removeClass(class_err.class);

        $(".btn-start").removeClass('disabled');
        $(".btn-stop").removeClass('disabled');
    }

    function set_status_spinner() {
        $(".btn-start").addClass('disabled');
        $(".btn-stop").addClass('disabled');
    }

    $(".btn-start").click(function() {
        index = $(this).data('id');
        $.ajax({
            url: '/on/' + index,
            type: "get",
            success: function(data) {
                console.log('Line ' + index + ' should be actived now');
                update_branches(data);
                set_status_ok();
            },
            error: function() {
                console.error("Can't update " + index);
                toogle_card(index, 0);

                set_status_error();
            }
        });
    });

    $(".btn-stop").click(function() {
        index = $(this).data('id');
        $.ajax({
            url: '/off/' + index,
            type: "get",
            success: function(data) {
                console.log('Line ' + index + ' should be deactived now');
                update_branches(data);
                set_status_ok();
            },
            error: function() {
                console.error("Can't update " + index);
                toogle_card(index, 0);

                set_status_error();
            }
        });
    });

    function update_branches_request() {
        $.ajax({
            url: '/status',
            success: function(data) {
                update_branches(data);
            },
            error: function() {
                console.error("Branches statuses are out-of-date");
                set_status_error();
            }
        });
    }

    function update_branches(json) {
        arr = json['branches']

        for (var i = 0; i < arr.length; i++) {
            branch = arr[i];            
            toogle_card(branch['id'], branch['status']);
        }
    }

    function toogle_card(element_id, branch_state) {
        if (branch_state == 1) {
            $('#card-' + element_id).addClass("card-irrigate-active");
            $('#btn-start-' + element_id).hide().addClass("hidden");
            $('#btn-stop-' + element_id).css('display', 'inline-block').removeClass("hidden");
        } else {
            $('#card-' + element_id).removeClass("card-irrigate-active");
            $('#btn-stop-' + element_id).hide().addClass("hidden");
            $('#btn-start-' + element_id).css('display', 'inline-block').removeClass("hidden");
        }
    }






















    //comming from template
    var buttons = ["drawer-f-l", "drawer-f-r", "drawer-f-t", "drawer-f-b"]

    $.each(buttons, function(index, position) {
        $('#' + position).click(function() {
            setDrawerPosition('bmd-' + position)
        })
    })

    // add a toggle for drawer visibility that shows anytime
    $('#drawer-visibility').click(function() {
        var $container = $('.bmd-layout-container')

        // once clicked, just do away with responsive marker
        //$container.removeClass('bmd-drawer-in-md')

        var $btn = $(this)
        var $icon = $btn.find('.material-icons')
        if ($icon.text() == 'visibility') {
            $container.addClass('bmd-drawer-out') // demo only, regardless of the responsive class, we want to force it close
            $icon.text('visibility_off')
            $btn.attr('title', 'Drawer allow responsive opening')
        } else {
            $container.removeClass('bmd-drawer-out') // demo only, regardless of the responsive class, we want to force it open
            $icon.text('visibility')
            $btn.attr('title', 'Drawer force closed')
        }
    })

});

// Comming from template
function clearDrawerClasses($container) {
    var classes = ["bmd-drawer-f-l", "bmd-drawer-f-r", "bmd-drawer-f-t", "bmd-drawer-f-b"];

    $.each(classes, function(index, value) {
        $container.removeClass(value)
    })
}

function setDrawerPosition(position) {
    var $container = $('.bmd-layout-container')

    clearDrawerClasses($container)
    $container.addClass(position)
}

function convert_date_to_time(date_str) {
    date = new Date(date_str);
    hours = ("0" + (date.getHours())).slice(-2);
    minutest = ("0" + (date.getMinutes())).slice(-2);
    return hours + ":" + minutest;
}

function convert_date(date_str) {
    date = new Date(date_str);
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);

    var res = date.getFullYear() + "-" + (month) + "-" + (day);

    return res;
}

function convert_date_to_local_date(add_to_date) {
    now = new Date();
    now.setDate(now.getDate() + parseInt(add_to_date));

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    return today;
}

function get_parameter_by_name(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}