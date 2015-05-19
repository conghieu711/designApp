<?php extract($_REQUEST); ?>

<div class="tb-layout-config-item row frame-info-js" data-tabid="{{tabID}}">
	<div class="tb-lcii-blog tb-blog-left col-md-6">
		<!-- Frame info -->
		<div class="tb-lciib-inner toggle-blog-js">
			<h4 class="tb-lcii-title">Frame info</h4>
			<div class="tb-toggle-blog-content">
				<div class="tb-form-group">
					<label>Frame name </label>
					<div class="tb-fg-field">
						<input type="text" class="tb-framename-js" name="tb-framename-js" placeholder="frame name" value="{{framename}}">
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

		<!-- Noted -->
		<div class="tb-lciib-inner toggle-blog-js">
			<h4 class="tb-lcii-title">Noted</h4>
			<div class="tb-toggle-blog-content">
				<div class="tb-form-group">
					<div class="tb-fg-field full">
						<textarea class="tb-note-js" name="tb-note-js" placeholder="...">{{noted}}</textarea>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="tb-lcii-blog tb-blog-right col-md-6">
		<!-- Noted -->
		<div class="tb-lciib-inner toggle-blog-js">
			<h4 class="tb-lcii-title">Layouts info</h4>
			<div class="tb-toggle-blog-content">
				<div class="layout-info-content">
					
				</div>
			</div>
		</div>
	</div>
</div>
