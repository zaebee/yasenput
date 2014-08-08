@Yapp.module "Components.Loading", (Loading, App, Backbone, Marionette, $, _) ->
	
  class Loading.LoadingView extends App.Views.ItemView
    template: 'LoadingView'
    className: "loading-container"
    
    onDestroy: ->
      @destroy()
