<?php extract($_REQUEST); ?>
<div class="tb-layout-config-item row" data-tabid="{tabID}">
	<div class="tb-lcii-blog tb-blog-left col-md-6">
		<div class="tb-lciib-inner">
			<h4 class="tb-lcii-title">Frame info</h4>
			<div class="tb-form-group">
				<label>Frame name </label>:
				<div class="tb-fg-field">
					<input type="text" name="tb-framename" placeholder="frame name" value="{framename}">
				</div>
			</div>
			<div class="tb-form-group">
				<label>Status </label>:
				<div class="tb-fg-field">
					<select name="tb-state">
						<?php 
						$_status = ['Published' => 'published', 'Pending' => 'pending']; 
						foreach($_status as $key => $value):
							$selected = ($value == $status)? 'selected' : '';
							echo "<option value='{$value}' {$selected}>{$key}</option>";
						endforeach;
						?>
					</select>
				</div>
			</div>
		</div>
	</div>

	<div class="tb-lcii-blog tb-blog-right col-md-6">
		<div class="tb-lciib-inner">
			<h4 class="tb-lcii-title">Noted</h4>
			<div class="tb-form-group">
				<label>Frame name </label>:
				<div class="tb-fg-field">
					<input type="text" placeholder="frame name">
				</div>
			</div>
		</div>
	</div>
</div>
