<?php extract($_REQUEST); ?>
<div class="tb-layout-config-item row frame-info-js" data-tabid="{tabID}">
	<div class="tb-lcii-blog tb-blog-left col-md-6">
		<div class="tb-lciib-inner">
			<h4 class="tb-lcii-title">Frame info</h4>
			<div class="tb-form-group">
				<label>Frame name </label>
				<div class="tb-fg-field">
					<input type="text" class="tb-framename-js" name="tb-framename-js" placeholder="frame name" value="{framename}">
				</div>
			</div>
			<div class="tb-form-group">
				<label>Status </label>
				<div class="tb-fg-field">
					<select class="tb-status-js" name="tb-status-js">
						<?php 
						$_status = ['Published' => 'published', 'Pending' => 'pending']; 
						foreach($_status as $key => $value):
							$selected = ($value == $status)? 'selected' : '';
							print "<option value='{$value}' {$selected}>{$key}</option>";
						endforeach;
						?>
					</select>
				</div>
			</div>
			<hr class="tb-hr"/>
			<div class="tb-form-group text-right">
				<button class="tb-btn delete-frame-js"><i class="ion-ios-close-outline"></i> Delete frame</button>
			</div>
		</div>
	</div>

	<div class="tb-lcii-blog tb-blog-right col-md-6">
		<div class="tb-lciib-inner">
			<h4 class="tb-lcii-title">Noted</h4>
			<div class="tb-form-group">
				<label>Frame name </label>
				<div class="tb-fg-field">
					<input type="text" placeholder="frame name">
				</div>
			</div>
		</div>
	</div>
</div>
