all:
	@echo "Lifting the server..."
	@sails lift

install:
	@echo "Installing back-end dependencies..."
	@npm install
	@echo "Installing front-end dependencies..."
	@bower install
