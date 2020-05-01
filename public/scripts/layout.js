$(document).ready(() => {

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