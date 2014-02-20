'use strict';

/* Controllers */

function HomeCtrl($scope, socket) {
  $scope.messages = [];
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });


  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });

    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });

    // clear message box
    $scope.message = '';
  };
  
  $scope.orderProp = '-available';
}

//PhoneListCtrl.$inject = ['$scope', '$http'];
function NavCtrl($scope, socket){
	// $scope.meetings = MeetingService.all;
}

//PhoneListCtrl.$inject = ['$scope', '$http'];
function SnapshotCtrl($scope, snapshot){
	var meeting = snapshot.get();
	console.log("Post retrieve:");console.log(meeting);
	$scope.comments = meeting;
}


function CreateCtrl($scope){
	// $scope.meeting = new Meeting();

	// $scope.add = function(meeting){
	// 	MeetingService.add(meeting, MeetingService.all);
	// 	$scope.meeting = new Meeting();
	// };
}

function MeetingCtrl($scope, $routeParams, socket, snapshot, $location) {
	socket.connect($routeParams.meetingName);
    socket.emit('subscribe', {name: $routeParams.meetingName});
	$scope.commentOrder = '-voters.length';
	$scope.userComment = new Comment();
	socket.on('init', function (data) 
	{
	    $scope.user = data.user;
	    $scope.meeting = data.meeting;
	});

	socket.on('user:join', function(data){
		$scope.meeting.participants.push(data.user);
	});

	socket.on('comment:post', function(data){
		$scope.meeting.comments.push(data.comment);
	});

	socket.on('user:left', function(data){
		var userToRemove = data.user;
		var allUsers = $scope.meeting.participants;
		for(var i = 0; i < allUsers.length; i++){
			if(allUsers[i] === userToRemove){
				allUsers.splice(i,1);
			}
		}

		var comments = $scope.meeting.comments;
        var totalComments = $scope.meeting.comments.length;
		for(var i = 0; i < totalComments; i++){
			if(comments[i].author == userToRemove){
				comments.splice(i,1);
                i--;
                totalComments--;
				continue;
			}
            
            var totalVoters = comments[i].voters.length;
            for(var j = 0; j < totalVoters; j++){
                if(comments[i].voters[j] === userToRemove){
                    comments[i].voters.splice(j,1);
                    j--;
                    totalVoters--;
                }
            }
//			var containingIndex = comments[i].voters.indexOf(userToRemove);
//			if(containingIndex !== -1){
//				comments[i].voters.splice(containingIndex,1);
//			} 
		}
	});

	socket.on('comment:vote', function(data){
		var allComments = $scope.meeting.comments;
		for(var i = 0; i < allComments.length; i++){
			if(allComments[i].author === data.comment.author && allComments[i].status === data.comment.status){
                allComments[i] = data.comment;        
            }
		}
	});

	$scope.sendComment = function(){
		var commentToPost = $scope.userComment;
		commentToPost.author = $scope.user;
		commentToPost.voters = [];
		socket.emit('comment:post',{
			comment: commentToPost
		});
		$scope.userComment = {};
	};

	$scope.vote = function(comment){
		var voter = $scope.user;
		socket.emit('comment:vote', {
			comment: comment,
			voter: voter
		});
	};

	$scope.snapshot = function(){
		snapshot.grab($scope.meeting.comments);
        socket.emit('unsubscribe');
        $location.url('snapshot');
	};

	function Comment(author){
		this.status = '';
		this.voters = [];
		this.author = author;
		this.votes = function(){return this.voters.length};
	}
} 
