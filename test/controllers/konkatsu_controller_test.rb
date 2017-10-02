require 'test_helper'

class KonkatsuControllerTest < ActionDispatch::IntegrationTest
  test "should get homepage" do
    get konkatsu_homepage_url
    assert_response :success
  end

end
