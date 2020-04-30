$(document).ready(() => {
	
	$('.complete-checkbox').on('change', (event) => {
		let box = $(event.target);
		console.log('/task/' + box.data('task-id'));

		$.ajax({
			url: '/task/' + box.data('task-id'),
			contentType: "application/json",
			type: 'PUT',
			data: JSON.stringify({
				complete: box.is(":checked")
			})
		}).then(res => {
			console.log(res);
			location.reload();
		}).catch(err => {
			console.error(err);
		});

	});
});