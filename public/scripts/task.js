$(document).ready(() => {

	let enable = $("#reminder").is(":checked");
	$("#dateInput").attr('disabled', !enable);
	$("#timeInput").attr('disabled', !enable);

	$('.btn-submit').attr("disabled", $("#titleInput").val() == "");

	$("#titleInput").on('change', e => {
		$('.btn-submit').attr("disabled", $("#titleInput").val() == "");
	});

	$("#reminder").on('change', e => {
		let enable = $(e.currentTarget).is(':checked');
		$("#dateInput").attr('disabled', !enable);
		$("#timeInput").attr('disabled', !enable);
	});
});

