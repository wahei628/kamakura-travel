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
    # emailでユーザーを検索（既存のcreateメソッドと同じ構造に合わせる）
    user = User.find_by(email: params[:email])
    
    if user.nil?
      render json: { 
        status: "error", 
        errors: ["ユーザーが見つかりません"] 
      }, status: :not_found
      return
    end

    # 名前を更新
    user.name = params[:name]

    if user.save
      render json: { 
        status: "ok", 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          uid: user.uid,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        message: "プロフィールを更新しました"
      }, status: :ok
    else
      render json: { 
        status: "error", 
        errors: user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
end