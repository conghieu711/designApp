<?php include_once '../functions.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Backend Design APP</title>
	<!-- jQuery lib -->
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>

	<!-- Bootstrap lib -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	
	<!-- Stylesheet + Script -->
	<link rel="stylesheet" type="text/css" href="assets/scss/style.php/style.scss">
	<link rel="stylesheet" type="text/css" href="assets/scss/style.php/da-admin.scss">
	<script type="text/javascript" src="assets/js/da-admin.js"></script>
</head>
<body>
	<div id="page">
		<div class="container">
			<div class="row">
				<h2 class="title text-center">Backend Design App</h2>
			</div>
			<div id="tb_backend_design_app" class="row tb-design-app-main">
				<div class="tb-header-tabs">
					<ul>
						<li><a href="#" class="tb-current-tab">First Frame</a></li>
						<li id="add-more-frame"><a href="#"><i class="ion-ios-plus"></i>  Add New Frame</a></li>
					</ul>
				</div>
				<div class="tb-body-tabs">
					<div class="body-tab tb-current-tab">
						<div class="body-tab-inner">
							<label for="field_upload_frame" class="tb-area-upload-frame">
								<div class="tb-upload-icon"><i class="ion-ios-cloud-upload"></i></div>
							</label>
							<div class="tb-frame-control-ui">
								<ul class="tb-frames-list-layout"></ul>
								<div class="tb-frames-main"></div>
							</div>
						</div>
					</div>
				</div>
				<input type="file" id="field_upload_frame" style="display: none;">
			</div>
		</div>
	</div>
</body>
</html>