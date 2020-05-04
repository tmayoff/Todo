$(document).ready(() => {
	
	$('.complete-checkbox').on('click', (event) => {
		let box = $(event.currentTarget);
		let taskId = box.data('taskId'); 
		let completed = box.hasClass('completed-unchecked');
		
		$.ajax({
			url: '/task/' + taskId,
			contentType: "application/json",
			type: 'PUT',
			data: JSON.stringify({
				complete: completed
			})
		}).then(res => {
			if (res != "OK") {
				console.log(res);
				return;
			}
			
			location.reload();
		}).catch(err => {
			console.error(err);
		});

	});

	$('.delete-task').on('click', (event) => {
		if(!confirm("Are you sure?")) {
			return;
		}

		let box = $(event.currentTarget);
		let taskId = box.data('taskId');
		
		$.ajax({
			url: '/task/' + taskId,
			contentType: "application/json",
			type: 'DELETE'
		}).then(res => {
			if (res != "OK") {
				console.log(res);
				return;
			}
			
			location.reload();
		}).catch(err => {
			console.error(err);
		});

	});

	$('#sort').on('change', event => {
		let sortBy = $(event.currentTarget).val();
		
		$.ajax({
			url: '/lists/' + $("#listId").val(),
			method: "PUT",
			data: {sort:sortBy + ",ASC"}
		})
		.then(res => {
			location.reload();
		}).catch(console.error)
	});
});