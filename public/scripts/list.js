$(document).ready(() => {
	
	$('.complete-checkbox').on('click', (event) => {
		let box = $(event.target);
		console.log(box.hasClass('completed-unchecked'));

		$.ajax({
			url: '/task/' + box.data('task-id'),
			contentType: "application/json",
			type: 'PUT',
			data: JSON.stringify({
				complete: box.hasClass('completed-unchecked')
			})
		}).then(res => {
			console.log(res);
			location.reload();
		}).catch(err => {
			console.error(err);
		});

	});
});