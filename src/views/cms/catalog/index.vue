<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="栏目名称" prop="catalogName">
        <el-input
            v-model="queryParams.catalogName"
            placeholder="请输入栏目名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示方式" prop="status">
        <el-select v-model="queryParams.status" placeholder="栏目状态" clearable style="width: 200px">
          <el-option
              v-for="dict in cms_catalog_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['cms:catalog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="catalogList"
        row-key="catalogId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="catalogName" label="栏目名称" width="260"></el-table-column>
      <el-table-column prop="catalogType" label="栏目类型" width="200">
        <template #default="scope">
          <dict-tag :options="cms_catalog_type" :value="scope.row.catalogType" />
        </template>
      </el-table-column>
      <el-table-column prop="linked" label="是否链接" width="100">
        <template #default="scope">
          <dict-tag :options="cms_catalog_linked" :value="scope.row.linked" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
      <el-table-column prop="status" label="显示方式" width="100">
        <template #default="scope">
          <dict-tag :options="cms_catalog_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:catalog:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['cms:catalog:add']">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:catalog:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改栏目对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="catalogRef" :model="form" :rules="rules" label-width="80px">
        <el-row>

          <el-col :span="12">
            <el-form-item label="栏目名称" prop="catalogName">
              <el-input v-model="form.catalogName" placeholder="请输入栏目名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.parentId !== 0">
            <el-form-item label="上级栏目" prop="parentId">
              <el-tree-select
                  v-model="form.parentId"
                  :data="catalogOptions"
                  :props="{ value: 'catalogId', label: 'catalogName', children: 'children' }"
                  value-key="catalogId"
                  placeholder="选择上级栏目"
                  check-strictly
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="栏目类型" prop="catalogType">
              <el-radio-group v-model="form.catalogType">
                <el-radio
                    v-for="dict in cms_catalog_type"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="栏目状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in cms_catalog_status"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                  v-model="form.deptId"
                  :data="deptOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="id"
                  placeholder="请选择归属部门"
                  check-strictly
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否链接" prop="linked">
              <el-radio-group v-model="form.linked">
                <el-radio
                    v-for="dict in cms_catalog_linked"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="form.linkUrl" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>

          <el-col :span="18">
            <el-form-item label="栏目图标" prop="catalogIcon">
              <el-input v-model="form.catalogIcon" placeholder="复制内容粘贴此处" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="" >
              <el-link href='https://fa6.dashgame.com/' target='_blank' type="primary" icon="search" >&nbsp;&nbsp;图标库</el-link>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Catalog">
import { listCatalog, getCatalog, delCatalog, addCatalog, updateCatalog,listCatalogExcludeChild} from "@/api/cms/catalog";
import { deptTreeSelect } from "@/api/system/user";

const { proxy } = getCurrentInstance();
const { cms_catalog_status } = proxy.useDict("cms_catalog_status");
const { cms_catalog_type } = proxy.useDict("cms_catalog_type");
const { cms_catalog_linked } = proxy.useDict("cms_catalog_linked");

const deptOptions = ref(undefined);
const catalogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const catalogOptions = ref([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    catalogName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: "上级栏目不能为空", trigger: "blur" }],
    catalogName: [{ required: true, message: "栏目名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    status: [{ required: true, message: "栏目状态不能为空", trigger: "blur" }],
    catalogType: [{ required: true, message: "栏目类型不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询栏目列表 */
function getList() {
  loading.value = true;
  listCatalog(queryParams.value).then(response => {
    catalogList.value = proxy.handleTree(response.data, "catalogId");
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 表单重置 */
function reset() {
  form.value = {
    catalogId: undefined,
    parentId: undefined,
    catalogName: undefined,
    linkUrl: undefined,
    catalogIcon: undefined,
    deptID: undefined,
    catalogType: "1",
    linked: "2",
    orderNum: 0,
    status: "1"
  };
  proxy.resetForm("catalogRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  listCatalog().then(response => {
    catalogOptions.value = proxy.handleTree(response.data, "catalogId");
  });
  if (row != undefined) {
    form.value.parentId = row.catalogId;
  }
  open.value = true;
  title.value = "添加栏目";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  listCatalogExcludeChild(row.catalogId).then(response => {
    catalogOptions.value = proxy.handleTree(response.data, "catalogId");
  });
  getCatalog(row.catalogId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改栏目";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["catalogRef"].validate(valid => {
    if (valid) {
      if (form.value.catalogId != undefined) {
        updateCatalog(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCatalog(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.catalogName + '"的数据项?').then(function() {
    return delCatalog(row.catalogId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();


/*********************************图标
 *
 */
import SvgIcon from "@/components/SvgIcon";
import IconSelect from "@/components/IconSelect";
import { ClickOutside as vClickOutside } from 'element-plus'
const showChooseIcon = ref(false);
const iconSelectRef = ref(null);

/** 图标外层点击隐藏下拉列表 */
function hideSelectIcon(event) {
  var elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
  var className = elem.className;
  if (className !== "el-input__inner") {
    showChooseIcon.value = false;
  }
}


/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
  showChooseIcon.value = true;
}
/** 选择图标 */
function selected(name) {
  form.value.catalogIcon = name;
  showChooseIcon.value = false;
}
/*********************************/


getDeptTree();


</script>
