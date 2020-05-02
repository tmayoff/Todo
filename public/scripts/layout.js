$(document).ready(() => {

	// List 
	$('.list').click((event) => {
		let clicked = $(event.target);
		if (!clicked.hasClass('list')) {
			return;
		}
		window.location = clicked.data('link');
	});

	$('.delete-list').click(e => {
		if(!confirm("Are you sure?")) {
			return;
		}

		let btn = $(e.currentTarget);
		let id = btn.data('id');
		$.ajax({
			url: '/lists/delete/' + id,
			contentType: "application/json",
			type: 'DELETE',
		}).then(res => {
			console.log(res);

			window.location = "/";
		}).catch(err => {
			console.error(err);
		});
	});

	// Sidebar
	$('#dismiss, .overlay').on('click', function () {
		// hide sidebar
		$('#sidebar').removeClass('active');
		// hide overlay
		$('.overlay').removeClass('active');
	});

	$('#sidebarCollapse').click(() => {
		$('#sidebar').addClass('active');
		
		$('.overlay').addClass('active');
		$('.collapse.in').toggleClass('in');
		$('a[aria-expanded=true]').attr('aria-expanded', 'false');
	});
});