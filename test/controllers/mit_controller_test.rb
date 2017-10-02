require 'test_helper'

class MitControllerTest < ActionDispatch::IntegrationTest
  test "should get homepage" do
    get mit_homepage_url
    assert_response :success
  end

end
