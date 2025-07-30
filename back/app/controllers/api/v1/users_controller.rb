class Api::V1::UsersController < ApplicationController
  def create
    user = User.find_or_initialize_by(email: params[:email], provider: params[:provider], uid: params[:uid])
    user.name = params[:name]

    if user.save
      render json: { status: "ok", user: user }, status: :ok
    else
      render json: { status: "error", errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_profile
    user = find_user_by_email
    return unless user

    user.name = params[:name]

    if user.save
      render_success_response(user)
    else
      render_error_response(user.errors.full_messages)
    end
  end

  private

    def find_user_by_email
      user = User.find_by(email: params[:email])
      return user if user

      render json: {
        status: "error",
        errors: ["ユーザーが見つかりません"],
      }, status: :not_found
      nil
    end

    def render_success_response(user)
      render json: {
        status: "ok",
        user: user_response_data(user),
        message: "プロフィールを更新しました",
      }, status: :ok
    end

    def render_error_response(errors)
      render json: {
        status: "error",
        errors: errors,
      }, status: :unprocessable_entity
    end

    def user_response_data(user)
      {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        uid: user.uid,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    end
end
