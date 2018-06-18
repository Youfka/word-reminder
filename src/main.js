function main() {

	document.querySelector('.add-button').addEventListener('click',function(){
		document.querySelector('body').classList.add("darken");
		document.querySelector('.add-popup').classList.remove("hidden");
	});
	document.querySelector('.cancel').addEventListener('click',function(){
		document.querySelector('body').classList.remove("darken");
		document.querySelector('.add-popup').classList.add("hidden");
	});

	document.querySelector('.add-work').addEventListener('click',function(){
		let task = {}
		task.name = document.querySelector('.name').value;
		task.time = document.querySelector('.time').value;
		task.deadline_date = 
			document.querySelector('.dl-date').value + ' ' 
			+ document.querySelector('.dl-time').value;
		task.action = '<button class="pause-task">Pause</button><button class="cancel-task">Cancel</button>';

		if(!task.name) {
			alert("Set task name!");
			return;
		}
		if(!task.time || task.time=="00:00") {
			alert("Set task time!");
			return;
		}
		if(!document.querySelector('.dl-date').value) {
			alert("Set deadline time!");
			return;
		}

		//check deadline date
		let time_date = new Date();
		time_date.setHours(time_date.getHours()+Number.parseInt(task.time.substring(0,2)));
		time_date.setMinutes(time_date.getMinutes()+Number.parseInt(task.time.substring(3)));
		if(new Date(task.deadline_date) < (new Date(time_date))) {
			alert("Your task time must end earlier than deadline date!");
			return;
		}

		document.querySelector('body').classList.remove("darken");
		document.querySelector('.add-popup').classList.add("hidden");

		let table_row = document.createElement("tr");
		let innerRow = '';

		for(let item in task){
			innerRow += '<td>' + task[item] + '</td>';
		}
		table_row.innerHTML = innerRow;
		document.querySelector('table tbody').appendChild(table_row);
		let time_cell = table_row.querySelector('td:nth-child(2)');
		let deadline_cell = table_row.querySelector('td:nth-child(3)');

		//start timers
		startTimer(task.time,time_cell,task.name);
		checkDeadline(task.deadline_date,deadline_cell,task.name);
		/*let now = new Date();
		let countDownTime = now.getHours()+now.setHours(now.getHours() + Number.parseInt(task.time.substring(0,2)),now.getMinutes() + Number.parseInt(task.time.substring(3)));
		let countDownDate = new Date(task.deadline_date);

		setInterval(function () {
			document.querySelector('table tbody td:nth-child(2)').innerHTML = new Date(countDownTime - Date.parse(now)).getHours() + ":" + new Date(countDownTime - Date.parse(now)).getMinutes();
		}, 1000);*/

		//cancel task
		let cancel_buttons = document.querySelectorAll('.cancel-task');
		if(cancel_buttons.length != 0) {
			cancel_buttons[cancel_buttons.length-1].addEventListener('click',removeTask);
		}

		//pause
		let pause_buttons = document.querySelectorAll('.pause-task');
		if(pause_buttons.length != 0) {
			pause_buttons[pause_buttons.length-1].addEventListener('click',function(){
				let tr = this.closest('tr');
				let time_cell = tr.querySelector('td:nth-child(2)');
				let name = tr.querySelector('td:nth-child(1)').innerHTML;
			  	tr.classList.toggle('paused'); 
				if(tr.classList.contains("paused")){
				    this.innerHTML = "Resume";
				    //tr.classList.add("paused");
			  	} else { 
				    this.innerHTML = "Pause";
				    //tr.classList.remove("paused");
				    startTimer(time_cell.innerHTML,time_cell,name);
			  	}
			});
		}
	});

	
	//timer for task
	function startTimer(duration,display,name){
		let hours = Number.parseInt(duration.substring(0,2));
		let minutes = Number.parseInt(duration.substring(3));
	  	let time = duration.substring(0,2) + ":" + duration.substring(3);
	  	display.innerHTML = time;
	  	if(display.parentNode.classList.contains("done")) {
			display.innerHTML ="Done!";
			return true;
		} else {
			let interval = setInterval(function () {
			if(display.nextElementSibling) { //if not deleted
			if(display.parentNode.classList.contains("paused")) { //if paused
		      clearInterval(interval);
		      return "paused";
		    }
				if (display.nextElementSibling.innerHTML == "Done!") { 
					return true;
				} else {
				    minutes--; 
				    if(minutes < 0){
				      minutes = 59;
				      if(hours) {
				        hours--;
				      } else {
				        hours = 0;
				      }
				    }
				    if(hours.toString()==0 && minutes.toString()==0) {
			      		outOfTimeModal(display,name);
		      			clearInterval(interval);
		      			return true;
			    	}
				      if(hours < 10 && hours.toString().length < 2) {hours = "0"+hours;}
				      if(minutes < 10 && minutes.toString().length < 2) {minutes = "0"+minutes;}
				      time = hours + ":" + minutes;
				      display.innerHTML = time;
				  }
		  		} else {clearInterval(interval); return false;}
	  		}, 60000);
		}
	  return time;
	}

	//timer for deadline
	function checkDeadline(deadline,display,name){
		let d_date, d_time;
		if(deadline.indexOf(" ") !== -1) {
			d_date = new Date(deadline.split(' ')[0]);
			d_time = deadline.split(' ')[1];
		} else {
			d_date = new Date(deadline);
			d_time = "00:00";
		}
		d_date.setHours(d_time.split(':')[0]);
		d_date.setMinutes(d_time.split(':')[1]);
		let dead_interval = setInterval(function () {
			let now = new Date();
			if(display.previousElementSibling) {
				if(display.parentNode.classList.contains("done")) {
					display.innerHTML ="Done!";
					display.parentNode.classList.add("done");
					display.nextElementSibling.innerHTML = '<button class="cancel-task">Remove</button>';
					display.parentNode.querySelector(".cancel-task").addEventListener('click',removeTask);
					return true;
				} else {
					if(d_date <= now){
						deadlineModal(display,name);
						clearInterval(dead_interval);
						return;
					} 
				}
			} else {clearInterval(dead_interval); return false;}
		}, 60000);
	}

	function removeTask() {
		let tr = this.closest('tr');
		if(tr) {
			tr.innerHTML = '';
			tr.remove();
			alert('Task cancelled!'); 
		}
	}
	function doneTask(display){
		display.innerHTML = 'Done!';
		console.log(display.nextElementSibling);
		if(display.nextElementSibling) {
			display.nextElementSibling.innerHTML = "Done!";
		} else {
			display.previousElementSibling.innerHTML = 'Done!';
		}
		display.parentNode.classList.add("done"); 
		display.parentNode.lastElementChild.innerHTML = '<button class="cancel-task">Remove</button>';
		display.parentNode.querySelector(".cancel-task").addEventListener('click',removeTask);					
	}

	function outOfTimeModal(time_display,name){
		document.querySelector('body').classList.add("darken");
		document.querySelector('.check-done').classList.remove("hidden");
		document.querySelector('.not-done').classList.remove("hidden");
		document.querySelector('.more_time').classList.add("hidden");
		document.querySelector('.question').innerHTML = `Have you done ${name}?`;
		let confirm_done = function(){
			document.querySelector('body').classList.remove("darken");
			document.querySelector('.check-done').classList.add("hidden");
			doneTask(time_display);
			return true;
		}
		let set_new_time = function(){
			document.querySelector('body').classList.remove("darken");
			document.querySelector('.check-done').classList.add("hidden");
			startTimer(document.querySelector('.more_time').value,time_display,name);
		}
		document.querySelector('.confirm-done').removeEventListener('click',set_new_time);
		document.querySelector('.confirm-done').addEventListener('click',confirm_done);

		document.querySelector('.not-done').addEventListener('click',function(){
			document.querySelector('.question').innerHTML = "How much time do you need?";
			document.querySelector('.more_time').classList.remove("hidden");
			this.classList.add("hidden");
			document.querySelector('.confirm-done').removeEventListener('click',confirm_done);
			document.querySelector('.confirm-done').addEventListener('click',set_new_time);
		});
	}

	function deadlineModal(deadline_display,name){
		document.querySelector('body').classList.add("darken");
		document.querySelector('.check-done').classList.remove("hidden");
		document.querySelector('.not-done').classList.remove("hidden");
		document.querySelector('.more_time').classList.add("hidden");
		document.querySelector('.question').innerHTML = `DEADLINE! Have you finished ${name}?`;
		let confirm_done = function(){
			document.querySelector('body').classList.remove("darken");
			document.querySelector('.check-done').classList.add("hidden");
			doneTask(deadline_display);
			return true;
		}
		document.querySelector('.confirm-done').addEventListener('click',confirm_done);

		document.querySelector('.not-done').addEventListener('click',function(){
			deadline_display.innerHTML ="Overdue!";
			deadline_display.parentNode.classList.add("failed");
			document.querySelector('.confirm-done').removeEventListener('click',confirm_done);
		});
	}
	
	
};




module.exports = main();