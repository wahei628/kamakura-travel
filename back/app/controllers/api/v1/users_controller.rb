class Api::V1::UsersController < ApplicationController

  def create
    user = User.find_or_initialize_by(email: params[:email], provider: params[:provider], uid: params[:uid])
    user.name = params[:name]
    if user.save
      render json: { status: 'ok', user: user }, status: :ok
    else
      render json: { status: 'error', errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
