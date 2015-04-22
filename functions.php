<?php
define('DIR', __DIR__);
define('DIR_PHPHELPER', DIR . '/phphelper/');

class designApp_helper{
	function use_scss( $fscss, $variable = [] ){
		include_once DIR_PHPHELPER . 'scssphp/scss.inc.php';

		$directory =  $fscss;
		$scss = new scssc();
		$scss->setFormatter("scss_formatter_compressed");

		$scss->setVariables($variable);

		$filelist = glob($directory . '/' . "*.scss");
		foreach ($filelist as $file_path) {
		    touch($file_path);
		}

		$server = new scss_server($directory, null, $scss);
		$server->serve();
	}
}