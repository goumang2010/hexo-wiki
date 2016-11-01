---
title: bootstrap
excerpt: 
categories: 
- FE
---



# 模态框
//包含vue字符
```
          <modal :show.sync="showEditRecordModal" effect="fade">
              <div slot="modal-header" class="modal-header">
                  <h4 class="modal-title">修改数据</h4>
              </div>
              <div slot="modal-body" class="modal-body">
                  <form id="editdata">
                      <div class="row">
                          <div class="col-lg-12">
                              <div class="form-group">
                                  <label>名称 <span style="color:red">*</span></label>
                                  <input
                                    type              = "text"
                                    name              = "name"
                                    class             = "form-control"
                                    data-msg-required = "不能为空"
                                    v-model           = "currentRecord.name"
                                    required>
                              </div>
                          </div>
                      </div>

                      <div class="row">
                          <div class="col-lg-12">
                              <div class="form-group">
                                  <label>联系人 <span style="color:red;">*</span></label>
                                  <input
                                    type              = "text"
                                    name              = "contact"
                                    class             = "form-control"
                                    data-msg-required = "不能为空"
                                    v-model           = "currentRecord.contact"
                                    required>
                              </div>
                          </div>
                      </div>

                      <div class="row">
                          <div class="col-lg-12">
                              <div class="form-group">
                                  <label>手机号 <span style="color:red;">*</span></label>
                                  <input
                                    type="text"
                                    name="phone"
                                    class="form-control"
                                    data-rule-mobile="true"
                                    data-msg-required="请输入手机号"
                                    data-msg-mobile="请输入正确格式"
                                    v-model="currentRecord.phone"
                                    required>
                              </div>
                          </div>
                      </div>

                      <div class="row">
                          <div class="col-lg-12">
                              <div class="form-group">
                                  <label>邮箱</label>
                                  <input
                                    type              = "email"
                                    name              = "email"
                                    class             = "form-control"
                                    data-rule-email   = "true"
                                    data-msg-required = "请输入email地址"
                                    data-msg-email    = "请输入正确的email地址"
                                    v-model           = "currentRecord.email"
                                    required>
                              </div>
                          </div>
                      </div>

                      <div class="row">
                          <div class="col-lg-12">
                              <div class="form-group">
                                  <label>备注</label>
                                  <textarea
                                    class="form-control"
                                    id="comment"
                                    name="description">{{ currentRecord.description }}</textarea>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
              <div slot="modal-footer" class="modal-footer">
                  <button type="button" class="btn btn-default" @click='editRecord_abort'>中止</button>
                  <button type="button" class="btn btn-danger"  @click='editRecord_save'>保存</button>
              </div>
          </modal>
```
