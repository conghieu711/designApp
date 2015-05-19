<?php include_once '../functions.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Backend Design APP</title>
	<!-- jQuery lib -->
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>

	<!-- mustache.js -->
	<script type="text/javascript" src="assets/js/mustache.js"></script>

	<!-- color-thief.js -->
	<script type="text/javascript" src="assets/js/color-thief.js"></script>

	<!-- Bootstrap lib -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

	<!-- Sweetalert lib -->
	<link rel="stylesheet" href="assets/css/sweetalert.css">
	<script type="text/javascript" src="assets/js/sweetalert.min.js"></script>
	
	<!-- Stylesheet + Script -->
	<link rel="stylesheet" type="text/css" href="assets/scss/style.php/style.scss">
	<link rel="stylesheet" type="text/css" href="assets/scss/style.php/da-admin.scss">
	<script type="text/javascript" src="assets/js/da-admin.js"></script>
	<script type="text/javascript">
		var JS_TEMP = 'assets/js/js-template/';
	</script>
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
						<li class="tb-tab-nav tb-current-tab"><a href="#" data-tab-name="first-tab">First Frame</a></li><!--
					--></ul>
					<span id="add-more-frame"><a href="#!"><i class="fa fa-plus-square"></i>  Add more</a></span>
				</div>
				<div class="tb-body-tabs">
					<div class="body-tab tb-current-tab" data-tab-name="first-tab">
						<div class="body-tab-inner">
							<label for="field_upload_frame" class="tb-area-upload-frame" title="upload">
								<div class="tb-upload-icon"><i class="ion-ios-cloud-upload"></i></div>
							</label>
							<div class="tb-frame-control-ui">
								<ul class="tb-frames-list-layout"></ul>
								<div class="tb-frames-main"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="tb-layout-config-main"></div>
				<input type="file" id="field_upload_frame" multiple style="display: none;">
			</div>
		</div>
	</div>
	<footer id="footer">
		© <?php echo date('Y'); ?> <a href="#">Themebears</a>
	</footer>
</body>
</html>