import { Props } from "..";
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import Example from "./example";

export default {
  title: "Example",
  component: Example,
  argTypes: {
    value: { control: "text" },
    readOnly: { control: "boolean" },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
    onClickHashtag: { action: "hashtag clicked" },
    onClickLink: { action: "link clicked" },
    onHoverLink: { action: "link hovered" },
    onShowToast: { action: "toast" },
    onFocus: { action: "focused" },
    onBlur: { action: "blurred" },
  },
} as Meta;

const Template: Story<Props> = args => <Example {...args} />;

export const Default = Template.bind({});
Default.args = {
  defaultValue: `

## Backend DSL

\`\`\`kotlin
repos {
    repo(name = "Backend", language = "Kotlin", scmUrl = "https://github.com/archguard/archguard")
    repo(name = "Scanner", language = "Kotlin", scmUrl = "https://github.com/archguard/scanner")
}
\`\`\`
  
## 架构 DSL 

\`\`\`kotlin
@file:DependsOn("org.archguard.scanner:doc-executor:2.0.0-alpha.6")
import org.archguard.dsl.*

val layer = layered {
    prefixId("org.archguard")
    component("interface") dependentOn component("application")
    组件("interface") 依赖于 组件("domain")
    component("interface") dependentOn component("infrastructure")

    组件("application") 依赖于 组件("domain")
    组件("application") 依赖于 组件("infrastructure")

    组件("domain") 依赖于 组件("infrastructure")
}

graph().show(layer.relations())
\`\`\`

## Scanner DSL

\`\`\`kotlin
linter('Backend').layer()
\`\`\`

  `,
};
